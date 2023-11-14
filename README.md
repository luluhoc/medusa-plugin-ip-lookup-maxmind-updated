## medusa-plugin-ip-lookup-maxmind

## About

### Description

Lookup a user's region using [MaxMind](https://www.maxmind.com/en/geoip2-services-and-databases).

### Preview

![Preview](/docs/preview.png)

## Set up this plugin

### Requirements

This plugin is made to work with MedusaJS. You can find the documentation [here](https://medusajs.com). Here's what you'll need to get started with this plugin:

- [Node.js](https://nodejs.org/en/)
- [Medusa Store](https://docs.medusajs.com/quickstart/quick-start/)
- [MaxMind GeoLite2 Free Geolocation Data](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data)

### Install Project

1. Install the plugin:

```bash
npm install medusa-plugin-ip-lookup-maxmind-geoip2

# or

yarn add medusa-plugin-ip-lookup-maxmind-geoip2
```

2. Obtain a IP geolocation database file from MaxMind. You can download a GeoLite2 Free Geolocation Data [here](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).

3. Add the plugin to your `medusa-config.js` file (inside the `plugins` array):

```ts
  {
    resolve: `medusa-plugin-ip-lookup-maxmind-geoip2`,
    /** @type {import('medusa-plugin-ip-lookup-maxmind-geoip2').PluginOptions} */
    options: {
      maxmind_db_path: "<PATH_TO_MAXMIND_DB_FILE>",
      route_enabled: true, // This route is under store so it's public
    },
  }
```

4. Check if the plugin is working by calling api call `GET /store/ip-lookup` with query param `ip` (e.g. `GET /store/ip-lookup)

You need to have a valid IP address in order to get a valid response. Localhost will not work.

### Example Response

```json
{
    "error": false,
    "message": "success",
    "region": {
        "id": "reg_01HEAZ934BD9JA8SE7033JHYHR",
        "created_at": "2023-11-03T16:11:53.194Z",
        "updated_at": "2023-11-03T16:11:53.194Z",
        "deleted_at": null,
        "name": "EU",
        "currency_code": "eur",
        "tax_rate": 0,
        "tax_code": null,
        "gift_cards_taxable": true,
        "automatic_taxes": true,
        "tax_provider_id": null,
        "metadata": null
    },
    "country_code": "fr"
}
```

---

## OPTIONS

```ts
{
  /**
   * DB PATH
   */
  maxmind_db_path: string;
  /**
   * IP LOOKUP SERVICE URL (OPTIONAL)
   * @returns {error: boolean, region: Region | null, country_code: string | null}
   */
  route_enabled?: boolean;
}
```

---
Thanks to

- GitHub - @stnguyen90
- Twitter - @stnguyen90
- Discord - BalistarDrake#3823
