import { FC, memo } from 'react';
import { ModalForm } from '@ant-design/pro-components';

interface IProps {
  showMoveTeamMember: boolean;
  setShowMoveTeamMember: any;
}

const MoveTeamMemberModel: FC<IProps> = (props: IProps) => {
  const { showMoveTeamMember = false, setShowMoveTeamMember } = props || {};

  return (
    <ModalForm
      width={600}
      title="移动团队成员"
      open={showMoveTeamMember}
      onOpenChange={setShowMoveTeamMember}
    >
      <div></div>
    </ModalForm>
  );
};

export default memo(MoveTeamMemberModel);
