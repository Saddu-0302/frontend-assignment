import Grid from "@/components/Grid";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return <>
    <div>
      <Head>
        <title className="text-xl">Spreadsheet App</title>
      </Head>

      <main className="flex justify-center items-center min-h-screen bg-gray-100">
        <Grid />
      </main>
    </div>
  </>
}
