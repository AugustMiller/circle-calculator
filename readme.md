# Circle Calculator

A crude tool for estimating the effects of circle settings in PUBG Custom games.

## Development

This is only set up to work in modern browsers with support for Javascript modules. There is no build or transpile step!

### Templating

However, I did choose to use Twig for the HTML, so you'll need to:

```
$ npm install
$ npm run watch
```

This will generate an `index.html` file in the `public` directory, and continue to watch for changes to the template.

### Note about Modules
If you change any "data" files imported by the build script (i.e. `maps.js`), you'll have to terminate + re-start the watcher. There are probably some bundlers or task runners that are capable of restarting, but I can't be arsed to set something like that up.


### Deployment

The entire `public` directory can be uploaded to a server at any time!


### Docker?

There's a `docker-compose.yml` file, so if you don't have a web server installed, just run `docker-compose up` in the project directory. This is probably not necessary, as all the paths are relative to `index.html` and should work over the file protocol just as easily.

:deciduous_tree:
