export type PluginOptions = {
  /**
   * DB PATH
   */
  maxmind_db_path: string;
  /**
   * IP LOOKUP SERVICE URL (OPTIONAL)
   * @returns {error: boolean, region: Region | null, country_code: string | null}
   */
  route_enabled?: boolean;
};