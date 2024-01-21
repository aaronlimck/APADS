const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
/** @type {import('next').NextConfig} */

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      logging: {
        fetches: {
          fullUrl: true
        }
      }
    };
  }

  return {
    images: {
      unoptimized: true
    }
  };
};
