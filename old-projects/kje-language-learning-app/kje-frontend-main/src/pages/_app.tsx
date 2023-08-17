import 'styles/globals.css'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { Navbar } from 'components/Navbar'
import uuid from 'react-uuid'

import axios from 'axios'
import { Layout } from 'layouts/App'
import 'regenerator-runtime/runtime'
import { Footer } from 'components/Footer'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'
axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>KJE</title>
        <meta name="description" content="Efficient Korean and Japanese lessons" />
      </Head>

      <Navbar />

      <Layout key={uuid()}>
        <Component {...pageProps} />
        <Footer />
      </Layout>
    </>
  )
}

export default MyApp
