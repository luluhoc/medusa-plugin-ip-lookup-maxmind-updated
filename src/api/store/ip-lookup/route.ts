import { ConfigModule, MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import IpLookupService from "../../../services/ip-lookup";
import { PluginOptions } from "../../../..";

type MyConfigModule = ConfigModule & {
  projectConfig: {
    custom_config?: string
  }
}

const getIp = (req) => {
    let ips = (
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress || ''
    ).split(',');

    return ips[0].trim();
} 

type ipLookupMatch = {
  resolve: string
  options: PluginOptions
} | undefined
export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  try {

    const configModule = req.scope.resolve<MyConfigModule>(
      "configModule"
    )
    
    const ipLookupService: IpLookupService = req.scope.resolve(
      "ipLookupService"
    )
    const regionService = req.scope.resolve<RegionService>(
      "regionService"
    )
    const ipLookupConfig = configModule.plugins.find((p) => typeof p !== 'string' && p?.resolve === 'medusa-plugin-ip-lookup-maxmind-geoip2') as ipLookupMatch

    if (!ipLookupConfig) {
      throw new Error('No ip lookup config found')
    }

    if (!ipLookupConfig.options.route_enabled) {
      throw new Error('Route not enabled')
    }

    const ip = getIp(req)
    const data = await ipLookupService.lookupIp(ip)
  
    if (!data.country?.isoCode) {
      throw new Error ("Couldn't detect country code.")
    }
  
    const region = await regionService
    .retrieveByCountryCode(data.country.isoCode)
  
    res.json({
      error: false,
      message: 'success',
      region,
      country_code: data.country.isoCode.toLowerCase()
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      message: process.env.NODE_ENV === 'production' || !process.env.DEV ? 'Internal server error' :  error.message,
      region: null,
      country_code: null
    })
  }
}
