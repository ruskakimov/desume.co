import Card from "../../common/components/Card";
import PrimaryButton from "../../common/components/PrimaryButton";

const stats = [
  { name: "Years of Experience", stat: "5" },
  { name: "Word Count", stat: "345" },
  { name: "Bullet Count", stat: "24" },
];

const ReviewPage: React.FC = () => {
  return (
    <div>
      <dl className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>

      <Card>
        <div className="text-center">
          <PrimaryButton>Start review</PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPage;
