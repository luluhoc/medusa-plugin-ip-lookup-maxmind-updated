import { ConfigModule, MedusaRequest, MedusaResponse, RegionService } from "@medusajs/medusa";
import IpLookupService from "../../services/ip-lookup";
import { PluginOptions } from "../../..";

type MyConfigModule = ConfigModule & {
  projectConfig: {
    custom_config?: string
  }
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
    const ip = req.headers["x-forwarded-for"] || 
      req.socket.remoteAddress
  
    const data = await ipLookupService.lookupIp(ip)
  
    if (!data.country?.isoCode) {
      throw new Error ("Couldn't detect country code.")
    }
  
    const region = await regionService
    .retrieveByCountryCode(data.country.isoCode)
  
    res.json({
      error: false,
      region,
      country_code: data.country.isoCode.toLowerCase()
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
      region: null,
      country_code: null
    })
  }
}
