import FormModal from "../../../../common/components/FormModal";
import useEditFlow from "../../../../common/hooks/useEditFlow";
import { BulletPoint } from "../../../../common/interfaces/resume";

type OpenRewriteModal = (bullet: BulletPoint) => Promise<BulletPoint>;

export default function useRewriteModal(): [OpenRewriteModal, React.ReactNode] {
  const { openEditDialog, buildDialogProps, confirmationPopups } =
    useEditFlow<BulletPoint>();

  const openModal: OpenRewriteModal = async (bullet: BulletPoint) => {
    const result = await openEditDialog({ isCreateNew: false });
    return result ?? bullet;
  };

  return [
    openModal,
    <FormModal
      {...buildDialogProps({
        titleName: "accomplishment",
        getIsDirty: () => false,
        getIsValid: async () => false,
        getData: () => ({ id: "", included: false, text: "" }),
      })}
    >
      <div></div>
      {confirmationPopups}
    </FormModal>,
  ];
}
