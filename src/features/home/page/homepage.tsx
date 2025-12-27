import MapComponent from "@/features/home/components/map";
import ResultsDrawer from "../components/results-drawer";
import FacilityDetailsDrawer from "../components/facility-details-drawer";

function HomePage() {
  return (
    <main className="h-full max-h-dvh">
      <section className="fixed inset-0 h-full w-full">
        <MapComponent />
      </section>
      <section>
        {/* <ResultsDrawer /> */}
        <FacilityDetailsDrawer />
      </section>
    </main>
  );
}

export default HomePage;
