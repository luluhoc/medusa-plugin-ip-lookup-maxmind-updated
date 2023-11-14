import IpLookupService from "../services/ip-lookup";
import { getIp } from "./store/ip-lookup/route";

export default {
  preCartCreation: async function (req, res, next) {
    try {
      if (req.body.region_id) {
        next();
        return;
      }

      const ipLookupService: IpLookupService =
        req.scope.resolve("ipLookupService");

      const regionService = req.scope.resolve("regionService")

      const ip = getIp(req);

      const data = await ipLookupService.lookupIp(ip);

      if (!data.country?.isoCode) {
        next();
        return;
      }

      const region = await regionService
        .retrieveByCountryCode(data.country.isoCode)
        .catch(() => void 0)

      if (!region) {
        next()
        return
      }
      // If country exists, add it to the body of the cart creation request
      req.body.region_id = region.id
      req.body.country_code = data.country.isoCode.toLowerCase()

      next()
    } catch (error) {
      next();
    }
  },
};
