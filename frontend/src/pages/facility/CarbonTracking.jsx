import CarbonList from "../../components/carbon/CarbonList";
import CarbonSummary from "../../components/carbon/CarbonSummary";

const CarbonTracking = () => {
    return (
        <div className="page-container">

            <h1>Carbon Impact Tracking</h1>

            <p>
                Track the environmental impact of your
                waste processing activities.
            </p>

            <CarbonSummary />

            <hr />

            <h2>Carbon Records</h2>

            <CarbonList />

        </div>
    );
};

export default CarbonTracking;