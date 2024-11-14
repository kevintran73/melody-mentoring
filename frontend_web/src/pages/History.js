import { CircularProgress, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import HistoryCard from "../components/history/HistoryCard";
import HistoryIntroCard from "../components/history/HistoryIntroCard";
import NavBar from "../components/nav_bar/NavBar";
import TokenContext from "../context/TokenContext";

/**
 * History page
 */

const StyledTopContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  margin: "2vw 10vw",
  height: "300px",
  gap: "1vw",
}));

const StyledSearchBar = styled(TextField)({
  marginBottom: "10px",
  width: "90%",
  width: "100%",
  borderRadius: '8px',
  marginBottom: "30px",
  backgroundColor: "white",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
});

const LoadingOverlayMain = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  zIndex: 1000,
});

// Get track attempts -> get details from each track attempt -> get song details of each track attempt
const History = () => {
  const [songDetails, setSongDetails] = useState([]);
  const { accessToken, userId } = React.useContext(TokenContext);

  // Get track attempts of user
  useEffect(() => {
    const fetchTrackAttempts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        fetchTrackDetails(response.data.track_attempts);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Get track details from track attempts
    const fetchTrackDetails = async (attemptIds) => {
      const trackDetails = [];

      for (const attemptId of attemptIds) {
        try {
          const response = await axios.get(
            `http://localhost:5001/track-attempt/${attemptId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          trackDetails.push(response.data);
        } catch (error) {
          console.error("Error fetching song details:", error);
        }
      }
      fetchSongDetails(trackDetails);
    };

    // Get song details from track details
    const fetchSongDetails = async (trackData) => {
      const allSongDetails = [];
      for (const track of trackData) {
        try {
          const response = await axios.get(
            `http://localhost:5001/catalogue/songs/find/${track["songId"]}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const date = new Date(track.isoUploadTime);

          const newSongDetail = {
            ...response.data,
            date: date,
            trackAttemptId: track["id"],
          };
          allSongDetails.push(newSongDetail);
        } catch (error) {
          console.error("Error fetching song details:", error);
        }
      }
      allSongDetails.sort((a, b) => b.date - a.date);
      setSongDetails(allSongDetails);
    };

    fetchTrackAttempts();
  }, []);

  //Allows for filtering based on search input
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredTracks = songDetails.filter(
    (song) =>
      song.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      song.composer.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Box backgroundColor='#000000'>
      <NavBar></NavBar>

      {/* Greeting element */}
      <StyledTopContainer>
        {/* <Box height="100%"> */}
          <HistoryIntroCard />
        {/* </Box> */}
      </StyledTopContainer>

      {/* Track attempts list */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginX="10vw"
      >
        <StyledSearchBar
          id="outlined-basic"
          label="Search"
          variant="outlined"
          onChange={handleSearchChange}
          value={searchInput}
        />
        {filteredTracks.length > 0 ? (
          filteredTracks.map((songDetail, i) => (
            <HistoryCard
              key={i}
              title={songDetail["title"]}
              composer={songDetail["composer"]}
              difficulty={songDetail["difficulty"]}
              date={new Intl.DateTimeFormat("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(songDetail.date)}
              thumbnail={songDetail["thumbnail"]}
              trackAttemptId={songDetail["trackAttemptId"]}
            />
          ))
        ) : (
          <LoadingOverlayMain>
            <CircularProgress size="20vh" />
          </LoadingOverlayMain>
        )}
      </Box>
    </Box>
  );
};

export default History;
