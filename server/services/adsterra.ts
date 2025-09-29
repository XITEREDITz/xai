export interface AdsterraConfig {
  publisherId: string;
  zoneId: string;
  adFormat: 'banner' | 'popup' | 'video' | 'native';
}

export class AdsterraService {
  private config: AdsterraConfig;

  constructor(config: AdsterraConfig) {
    this.config = config;
  }

  generateAdScript(): string {
    return `
      <script type="text/javascript">
        atOptions = {
          'key': '${this.config.zoneId}',
          'format': 'iframe',
          'height': 250,
          'width': 300,
          'params': {}
        };
        document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.effectivedisplayformats.com/DisplayFormats/adOptions.min.js"></scr' + 'ipt>');
      </script>
    `;
  }

  generatePopupScript(): string {
    return `
      <script type="text/javascript">
        var _pop = _pop || [];
        _pop.push(['siteId', ${this.config.publisherId}]);
        _pop.push(['minBid', 0]);
        _pop.push(['popundersPerIP', 1]);
        _pop.push(['delayBetween', 0]);
        _pop.push(['default', false]);
        _pop.push(['defaultPerDay', 0]);
        _pop.push(['topmostLayer', false]);
        (function() {
          var pa = document.createElement('script'); pa.type = 'text/javascript'; pa.async = true;
          var s = document.getElementsByTagName('script')[0]; 
          pa.src = '//c1.effectiveviewport.com/p.js';
          pa.onerror = function() {
            var sa = document.createElement('script'); sa.type = 'text/javascript'; sa.async = true;
            sa.src = '//c2.effectiveviewport.com/p.js';
            s.parentNode.insertBefore(sa, s);
          };
          s.parentNode.insertBefore(pa, s);
        })();
      </script>
    `;
  }

  generateVideoAdConfig() {
    return {
      publisherId: this.config.publisherId,
      zoneId: this.config.zoneId,
      rewardCoins: 15, // Coins earned per 30s video ad
      duration: 30, // seconds
    };
  }

  validateAdView(userId: string, adType: string): boolean {
    // Implement ad view validation logic
    // Check if user hasn't viewed too many ads recently
    // Validate ad completion
    return true;
  }

  calculateCoinReward(adType: string, duration: number): number {
    switch (adType) {
      case 'video':
        return Math.floor(duration / 30) * 15; // 15 coins per 30s
      case 'banner':
        return 5;
      case 'popup':
        return 10;
      default:
        return 5;
    }
  }
}

export const adsterraService = new AdsterraService({
  publisherId: process.env.ADSTERRA_PUBLISHER_ID || '',
  zoneId: process.env.ADSTERRA_ZONE_ID || '',
  adFormat: 'video'
});
