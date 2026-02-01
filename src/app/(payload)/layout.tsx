/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {/* Prevent runtime error: "Failed to execute 'measure' on 'Performance': 'DocumentView' cannot have a negative time stamp." */}
    <script
      dangerouslySetInnerHTML={{
        __html: `try {
      const origMeasure = performance.measure;
      performance.measure = function(name, startMark, endMark) {
        try {
          // Some browsers may throw if the time stamp is negative; guard against that.
          return origMeasure.apply(this, arguments);
        } catch (err) {
          // swallow the error so admin UI can render; log for debugging
          // eslint-disable-next-line no-console
          console.warn('performance.measure error ignored:', err && err.message ? err.message : err);
          return undefined;
        }
      };
    } catch (e) { /* ignore */ }`,
      }}
    />
    {children}
  </RootLayout>
)

export default Layout
