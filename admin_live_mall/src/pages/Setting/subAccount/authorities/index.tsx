import { PageContainer } from '@ant-design/pro-components';
import AuthProTable from './components/AuthProTable';

export default () => {
  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <AuthProTable />
    </PageContainer>
  );
};
