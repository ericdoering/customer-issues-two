# Review Changes list-marker repro (SAPP-4620)

Linear: https://linear.app/sanity/issue/SAPP-4620
Reported by Red Ventures: list items (bullet/numbered) show as plain strings in Review Changes.

## Steps

1. `npm install`
2. `npm run seed` (creates a published doc plus a draft that adds "bullet test" and "numbered test")
3. `npm run dev`, then open http://localhost:3333/structure/listReproArticle;repro-sapp-4620
4. Open the **⋯** menu at the top right of the document pane and choose **History**. The panel that opens on the right is the Review Changes view; look at the **Intro Body** diff.

**Expected:** the added items show a • and a 1. marker, like in the editor.
**Actual:** they show as plain text.

Re-run `npm run seed` any time to reset the doc.
