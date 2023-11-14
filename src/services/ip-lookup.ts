
import { Reader, ReaderModel } from "@maxmind/geoip2-node";
import { TransactionBaseService } from '@medusajs/medusa';
import { PluginOptions } from "../..";
class IpLookupService extends TransactionBaseService {
  options_: PluginOptions;
  reader_: ReaderModel;

  constructor({}, options: PluginOptions) {
    super(options);

    this.options_ = options;
  }

  async lookupIp(ipAddress: string) {
    if (!this.reader_) {
      this.reader_ = await Reader.open(this.options_["maxmind_db_path"]);
    }

    return this.reader_.country(ipAddress);
  }
}

export default IpLookupService;
