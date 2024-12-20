import Head from "next/head";
import Header from "@components/header";
import PaperByDate from "@components/papers/PaperByDate";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetServerSideProps } from 'next';

const Papers: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t("paper.paperClass")}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <PaperByDate />
                </section>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
  };
};

export default Papers;