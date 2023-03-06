import { launchRewriteModeReason } from "../../../../common/constants/reject-reasons";
import useBulletModal, { OpenBulletModal } from "./useBulletModal";
import useRewriteModal from "./rewrite/useRewriteModal";

/**
 * A convenience hook that combines bullet edit and rewrite and features the same interface as `useBulletModal`.
 */
export default function useBulletFlow(): [OpenBulletModal, React.ReactNode] {
  const [openBulletModal, bulletModal] = useBulletModal();
  const [openRewriteModal, rewriteModal] = useRewriteModal();

  return [
    async (bullet, hasDelete) => {
      return openBulletModal(bullet, hasDelete).catch((reason) => {
        if (bullet && reason === launchRewriteModeReason) {
          return openRewriteModal(bullet);
        } else {
          throw reason;
        }
      });
    },
    <>
      {bulletModal}
      {rewriteModal}
    </>,
  ];
}
