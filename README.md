# ragerx-foss-frontend-vue

Open source (BSD-3) frontend for RagerX compatible pools built with Vue.js and Bootstrap. Please refer to the [Pool Install Instructions](https://github.com/ragerxlol/ragerx-foss-install-instructions) for full details on how to start a RagerX pool.

![RagerX FOSS Frontend](src/assets/Screenshot.png?raw=true "RagerX FOSS Frontend")
![RagerX FOSS Frontend](src/assets/Screenshot-2.png?raw=true "RagerX FOSS Frontend")

## Configuring the Frontend

Copy `config.example.json` to `config.json` and edit the few fields.

```
{
  "general": {
    /* Display name of your pool */
    "pool_name": "My Pool"
  },
  "api": {
    /* URL of ragerx-foss-api */
    /* localhost:8227 if you are running the api server locally */
    /* likely you will set it to https://example.com/api or just /api */
    "url": "/api",

    /* How often the frontend should poll the API for updates in seconds */
    "polling_interval": 30
  },
  "links": [
    /* Optional list of links to add to the navigation bar */
    { "title": "Telegram", "href": "https://t.me/ragerxlol" },
    { "title": "Reddit", "href": "https://reddit.com/r/ragerx" }
  ]
}
```

## Building and Development

Install dependencies:
```
yarn install
```

Start a development server:
```
yarn dev
```

Compile and minify for production:
```
yarn build
```

## Customizing Appearance

You can customize theming / colors by editing `src/css/bootstrap.scss`. At a minimum, you probably want to change the `$primary` and `$secondary` colors, however you can edit much more if you wish to. You can override any bootstrap SCSS variable in this file. Refer to the [Theming Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/theming/) documentation.

### Contributing

Feel free to send PRs with improvements or other features.

### License

This code is released under the BSD-3-Clause license.
