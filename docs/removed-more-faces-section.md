# Removed section: "More faces. More attitude." (The lifestyle edit)

Removed from `index.html` on 2026-11-24 per the Helium website edits doc ("Remove this section").
Saved here so it can be restored or reused.

## Copy

- Eyebrow: The lifestyle edit
- Heading: More faces. / More *attitude.*
- Intro: Work, dinner, a wedding, a drive. Four looks from the edit, a different set each time you come back.
- Link: "Shop the edit" -> https://www.brunomilano.com/collections/best-sellers
- Previous / next arrow buttons (mobile carousel)

## The four looks

| Label | Line | Product link | Image alt |
|---|---|---|---|
| The concert | Lights up. | /products/verona-amore-leopardo | Woman at a concert wearing Verona Amore - Leopardo |
| The wedding | Before the vows. | /products/radiante-heritage-blu | Man at a wedding wearing Radiante Heritage - Blu |
| Dinner | Held at the table. | /products/lombardy-luxe-rosa-teal | Woman at dinner wearing Lombardy Luxe - Rosa Teal |
| The drive | Window down. | /products/sportiva-classic-blu | Man on a weekend drive wearing Sportiva Classic - Blu |

Images are 1024x1024 generated lifestyle shots (square, one per look). In the original site they were hosted on assets.gethelium.co. They are still in `js/site.js` (the `edit` pool, which rotated which four of eight looks were shown on each visit) and downloaded locally in `bruno-milano-site/assets/remote/` in the handoff folder.

## Behaviour (still in code, now inactive)

- `js/site.js`: `editCard()`, the `[data-edit]` grid, random pick of four looks per visit, and an auto-advancing carousel on mobile. It does nothing when the section is absent.
- `css/site.css`: all `.edit*` rules (grid, cards, hover zoom, mobile carousel, touch states). Safe to delete if the section will not return.

## Original HTML

```html
      <section class="edit" aria-labelledby="edit-title">
        <div class="edit-head">
          <p class="edit-kicker">The lifestyle edit</p>
          <h2 id="edit-title">More faces.<br />More <em>attitude.</em></h2>
          <div class="edit-intro">
            <p>
              Work, dinner, a wedding, a drive. Four looks from the edit, a different set each time you come back.
            </p>
            <a href="https://www.brunomilano.com/collections/best-sellers">Shop the edit</a>
          </div>
          <div class="edit-controls shelf-controls">
            <button type="button" data-edit-prev aria-label="Previous looks">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
            </button>
            <button type="button" data-edit-next aria-label="Next looks">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="edit-grid" data-edit>
          <a class="edit-card" href="https://www.brunomilano.com/products/verona-amore-leopardo">
            <img
              src="https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/ca3f6376-3e64-4da0-9fce-a2a2d2af808f/0-2135e514090b78e5ec19caf1092366cd88942f2e1b10949d7a382ef814f242cb.png"
              alt="Woman at a concert wearing Verona Amore - Leopardo"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div class="edit-card-copy">
              <span>The concert</span>
              <strong>Lights up.</strong>
            </div>
          </a>
          <a class="edit-card" href="https://www.brunomilano.com/products/radiante-heritage-blu">
            <img
              src="https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/3ab7710a-685a-4ec4-9e92-43c5c407b089/0-a505c8474bf24d6340c9d70532589f380b1c7b5bd017174469750f5dbf69a83c.png"
              alt="Man at a wedding wearing Radiante Heritage - Blu"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div class="edit-card-copy">
              <span>The wedding</span>
              <strong>Before the vows.</strong>
            </div>
          </a>
          <a class="edit-card" href="https://www.brunomilano.com/products/lombardy-luxe-rosa-teal">
            <img
              src="https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/b4f9c947-ed6c-4a7c-8073-333958bdd163/0-a0ceb0f0b3dbe00ae3199bdcac05af757333e4482dc4872bee176e16220e596a.png"
              alt="Woman at dinner wearing Lombardy Luxe - Rosa Teal"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div class="edit-card-copy">
              <span>Dinner</span>
              <strong>Held at the table.</strong>
            </div>
          </a>
          <a class="edit-card" href="https://www.brunomilano.com/products/sportiva-classic-blu">
            <img
              src="https://assets.gethelium.co/workspaces/8e1e09b2-cbed-4d3c-b595-0e0489afab3d/generative/84b3cbbe-fd88-4ca1-99e3-6b6ed973c1a5/0-814abc565b651120dd3c585fec7a2ac7921aea48cd662b28794b095fcc659afc.png"
              alt="Man on a weekend drive wearing Sportiva Classic - Blu"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div class="edit-card-copy">
              <span>The drive</span>
              <strong>Window down.</strong>
            </div>
          </a>
        </div>
      </section>
```

---

## Update 2026-11-24: section restored, text bar removed

The section was restored, then the text bar above the cards (eyebrow, heading, intro, "Shop the edit" link and arrows) was removed. The four look cards stay. Removed bar:

```html
        <div class="edit-head">
          <p class="edit-kicker">The lifestyle edit</p>
          <h2 id="edit-title">More faces.<br />More <em>attitude.</em></h2>
          <div class="edit-intro">
            <p>
              Work, dinner, a wedding, a drive. Four looks from the edit, a different set each time you come back.
            </p>
            <a href="https://www.brunomilano.com/collections/best-sellers">Shop the edit</a>
          </div>
          <div class="edit-controls shelf-controls">
            <button type="button" data-edit-prev aria-label="Previous looks">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
            </button>
            <button type="button" data-edit-next aria-label="Next looks">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </button>
          </div>
        </div>
```
