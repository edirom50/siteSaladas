import { Admin } from '@/page-components/Admin';
import Head from 'next/head';

const AdminPage = () => {
  return (
    <>
      <Head>
        <title>Adiministração</title>
      </Head>
      <Admin />
    </>
  );
};

export default AdminPage;
