import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Chevron from "../assets/Chevron.svg";
import React from "react";
// import { uploadData } from "aws-amplify/storage";

// Define types for props if needed (if 'id' is passed as a prop, which is not currently being used)
interface LoadoutPageProps {
  id?: string; // Example for 'id' prop if required
}

const LoadoutPage: React.FC<LoadoutPageProps> = ({ }) => {
  // The state for file should be either File or undefined (as initial state is undefined)
  const [file, setFile] = React.useState<File | undefined>(undefined);

  // Type the event properly
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0]);
  };

  const handleClick = () => {
    if (!file) {
      return;
    }

    // uploadData({
    //   path: ({ identityId }: { identityId: string }) =>
    //     `audioFiles/${identityId}/A1.WAV`,
    //   data: file,
    // });
  };

  return (
    <div className="LoadoutPageContainer">
      <Navbar isConnected={ true }/>
      <h1>
        <Link to="/">
          MY <b>SP</b>CLOUD
        </Link>{" "}
        &gt; LOADOUT 1
      </h1>
      <div className="ViewLoadout">
        <ol>
          {["BANK A", "BANK B", "BANK C", "BANK D", "BANK E", "BANK F", "BANK G", "BANK H", "BANK I", "BANK J"].map(
            (bank, index) => (
              <li key={index}>
                {bank}
                <img src={Chevron} alt="Chevron Icon" />
                <hr />
              </li>
            )
          )}
        </ol>
      </div>
      <div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick}>Upload</button>
      </div>
    </div>
  );
};

export default LoadoutPage;
