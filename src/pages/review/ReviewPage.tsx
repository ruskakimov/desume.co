import Card from "../../common/components/Card";

const ReviewPage: React.FC<{}> = (props) => {
  return (
    <div className="pb-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-5">
      <div className="mb-8 lg:mb-0">
        <Card>Hello</Card>
      </div>

      <Card>Hello2</Card>
    </div>
  );
};

export default ReviewPage;
