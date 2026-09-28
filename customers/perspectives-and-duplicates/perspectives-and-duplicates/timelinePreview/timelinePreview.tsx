import {useEffect, useMemo, useState} from 'react'
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  TextInput,
} from '@sanity/ui'
import {Code} from '@sanity/ui/code'
import {useClient} from 'sanity'

const API_VERSION = '2025-02-19'

type Release = {name: string; title?: string; state: string; at: string}
type Slide = {_id: string; heading?: string; ctaLabel?: string; imageUrl?: string} | null
type Card_ = {_id: string; title?: string; label?: string} | null
type Section = {_id: string; title?: string; slides?: Slide[]; subNav?: Card_[]} | null
type Page = {title?: string; sections?: Section[]} | null

// Releases that have a publish date: scheduled ones use publishAt,
// unscheduled ones use their intended date
const RELEASES_QUERY = `releases::all()[
  state in ["active", "scheduled"] &&
  defined(coalesce(publishAt, metadata.intendedPublishAt))
]{
  name,
  state,
  "title": metadata.title,
  "at": coalesce(publishAt, metadata.intendedPublishAt)
}`

const PAGES_QUERY = `*[_type == "landingPage"]{_id, title} | order(title asc)`

const PAGE_QUERY = `*[_type == "landingPage" && _id == $id][0]{
  title,
  sections[]->{
    _id,
    title,
    slides[]->{_id, heading, ctaLabel, "imageUrl": image.asset->url},
    subNav[]->{_id, title, label}
  }
}`

// <input type="datetime-local"> expects local time as "YYYY-MM-DDTHH:mm"
const toLocalInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})

export function TimelinePreview() {
  const client = useClient({apiVersion: API_VERSION})
  const [releases, setReleases] = useState<Release[]>([])
  const [pages, setPages] = useState<{_id: string; title?: string}[]>([])
  const [pageId, setPageId] = useState('')
  const [at, setAt] = useState(() => toLocalInput(new Date()))
  const [page, setPage] = useState<Page>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load releases and the list of pages once
  useEffect(() => {
    client
      .withConfig({perspective: 'raw'})
      .fetch<Release[]>(RELEASES_QUERY)
      .then((list) => setReleases(list.sort((a, b) => Date.parse(a.at) - Date.parse(b.at))))
      .catch((err) => setError(String(err)))

    client
      .withConfig({perspective: 'published'})
      .fetch<{_id: string; title?: string}[]>(PAGES_QUERY)
      .then((list) => {
        setPages(list)
        if (list[0]) setPageId((current) => current || list[0]._id)
      })
      .catch((err) => setError(String(err)))
  }, [client])

  // Releases live by the chosen time, latest first (the first entry has the highest priority)
  const liveReleases = useMemo(() => {
    const cutoff = new Date(at).getTime()
    return releases
      .filter((release) => Date.parse(release.at) <= cutoff)
      .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
  }, [releases, at])

  const perspective = useMemo(
    () => (liveReleases.length ? liveReleases.map((release) => release.name) : 'published'),
    [liveReleases],
  )

  // Query the page as it will look at the chosen time
  useEffect(() => {
    if (!pageId) return
    setLoading(true)
    setError(null)
    client
      .withConfig({perspective: perspective as string[]})
      .fetch<Page>(PAGE_QUERY, {id: pageId})
      .then(setPage)
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [client, pageId, perspective])

  return (
    <Container width={2} padding={4}>
      <Stack gap={4}>
        <Heading size={2}>Timeline preview</Heading>

        <Card padding={4} radius={2} border>
          <Stack gap={4}>
            <Stack gap={2}>
              <Text size={1} weight="semibold">Page</Text>
              <Select value={pageId} onChange={(e) => setPageId(e.currentTarget.value)}>
                {pages.map((p) => (
                  <option key={p._id} value={p._id}>{p.title ?? p._id}</option>
                ))}
              </Select>
            </Stack>

            <Stack gap={2}>
              <Text size={1} weight="semibold">Preview the site as of</Text>
              <TextInput
                type="datetime-local"
                value={at}
                onChange={(e) => setAt(e.currentTarget.value)}
              />
              <Flex gap={2} wrap="wrap">
                <Button
                  mode="ghost"
                  text="Now"
                  onClick={() => setAt(toLocalInput(new Date()))}
                />
                {releases.map((release) => (
                  <Button
                    key={release.name}
                    mode="ghost"
                    text={`${release.title ?? release.name}: ${formatDate(release.at)}`}
                    onClick={() => setAt(toLocalInput(new Date(release.at)))}
                  />
                ))}
              </Flex>
            </Stack>

            <Stack gap={2}>
              <Text size={1} weight="semibold">Releases</Text>
              {releases.length === 0 && (
                <Text size={1} muted>No releases with a date yet.</Text>
              )}
              {releases.map((release) => {
                const live = liveReleases.some((r) => r.name === release.name)
                return (
                  <Flex key={release.name} gap={2} align="center">
                    <Badge tone={live ? 'positive' : 'default'}>
                      {live ? 'Included' : 'Not yet'}
                    </Badge>
                    <Text size={1}>
                      {release.title ?? release.name} ({formatDate(release.at)}, {release.state})
                    </Text>
                  </Flex>
                )
              })}
            </Stack>

            <Stack gap={2}>
              <Text size={1} weight="semibold">Perspective sent with the query</Text>
              <Code size={1}>{JSON.stringify(perspective)}</Code>
            </Stack>
          </Stack>
        </Card>

        {error && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        )}

        <Card padding={4} radius={2} border tone="transparent">
          {loading ? (
            <Flex justify="center"><Spinner /></Flex>
          ) : !page ? (
            <Text muted>This page doesn't exist at the chosen time.</Text>
          ) : (
            <Stack gap={4}>
              <Heading size={3}>{page.title}</Heading>
              {(page.sections ?? []).filter(Boolean).map((section) => (
                <Card key={section!._id} padding={3} radius={2} border>
                  <Stack gap={3}>
                    <Text weight="semibold">{section!.title}</Text>
                    <Flex gap={3} wrap="wrap">
                      {(section!.slides ?? []).filter(Boolean).map((slide) => (
                        <Card key={slide!._id} padding={3} radius={2} shadow={1} style={{width: 220}}>
                          <Stack gap={2}>
                            {slide!.imageUrl && (
                              <img
                                src={`${slide!.imageUrl}?w=440`}
                                alt=""
                                style={{width: '100%', borderRadius: 4}}
                              />
                            )}
                            <Text weight="semibold">{slide!.heading}</Text>
                            {slide!.ctaLabel && <Badge>{slide!.ctaLabel}</Badge>}
                          </Stack>
                        </Card>
                      ))}
                    </Flex>
                    <Flex gap={2} wrap="wrap">
                      {(section!.subNav ?? []).filter(Boolean).map((card) => (
                        <Badge key={card!._id} tone="primary">
                          {card!.label ?? card!.title}
                        </Badge>
                      ))}
                    </Flex>
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  )
}