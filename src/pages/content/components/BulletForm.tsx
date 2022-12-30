import { MinusCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import SecondaryButton from "../../../common/components/SecondaryButton";
import { withReplacedAt } from "../../../common/functions/array";
import { BulletPoint } from "../../../common/interfaces/resume";

export interface FormBullet extends BulletPoint {
  shouldDelete: boolean;
}

interface BulletFormProps {
  bullets: FormBullet[];
  onChange: (bullets: FormBullet[]) => void;
}

const BulletForm: React.FC<BulletFormProps> = ({ bullets, onChange }) => {
  return (
    <div className="mt-12">
      <h3 className="mb-4 text-base font-medium text-gray-700">
        Bullet points
      </h3>

      <div className="flex flex-col gap-4">
        {bullets.map((bullet, index) => (
          <div key={bullet.id} className="flex items-center gap-2">
            <textarea
              className={classNames(
                "block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm",
                {
                  "cursor-not-allowed border-red-200 bg-red-50 text-red-400":
                    bullet.shouldDelete,
                }
              )}
              rows={2}
              disabled={bullet.shouldDelete}
              value={bullet.text}
              onChange={(e) => {
                onChange(
                  withReplacedAt(bullets, index, {
                    ...bullet,
                    text: e.target.value,
                  })
                );
              }}
              autoFocus
            />

            <button
              type="button"
              className={classNames(
                "flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-mouse-focus-ring",
                {
                  "text-gray-400 hover:text-gray-700": !bullet.shouldDelete,
                  "text-red-400 hover:text-red-700": bullet.shouldDelete,
                }
              )}
              onClick={() => {
                onChange(
                  withReplacedAt(bullets, index, {
                    ...bullet,
                    shouldDelete: !bullet.shouldDelete,
                  })
                );
              }}
            >
              <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ))}

        <div>
          <SecondaryButton
            onClick={() => {
              onChange([
                ...bullets,
                {
                  id: generateId(),
                  text: "",
                  included: true,
                  shouldDelete: false,
                },
              ]);
            }}
          >
            Add bullet point
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

function generateId(): string {
  return new Date().getTime().toString();
}

export default BulletForm;
