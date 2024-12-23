import {
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  Paper,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { setCompetitions } from "../../../../slices/competitions";
import { Link } from "react-router-dom";

const GetEvents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const competitions = useSelector(
    (state: RootState) => state.competitions.competitions
  );
  const userId = userInfo?.id;

  const getCompetitions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/getcompetitions",
        { user_id: userId }
      );
      dispatch(setCompetitions(response.data.competitions));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setError(
        `Failed to fetch competitions. Please try again later. ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEventJoin = async (id: number | null) => {
    if (!userId || id === null) {
      setError("Invalid user or competition ID");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/joincompetition",
        {
          user_id: userId,
          competition_id: id,
          is_active: true,
        }
      );

      if (response.status === 200) {
        const updatedCompetitions = competitions.map((competition) =>
          competition.id === id ? { ...competition, joined: true } : competition
        );
        dispatch(setCompetitions(updatedCompetitions));
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setError(
        `Failed to join competition. Please try again later. ${errorMessage}`
      );
    }
  };

  useEffect(() => {
    getCompetitions();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Competitions
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" color="error.main">
          <Typography>{error}</Typography>
        </Box>
      )}

      {competitions && !loading && !error ? (
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {competitions.map((competition) => (
            <Paper
              key={competition.id}
              sx={{
                padding: 2,
                margin: 2,
                boxShadow: 2,
                height: 250,
                width: 350,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
                flex: "1 1 300px", 
              }}
            >
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {competition.name}
              </Typography>

              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                {competition.description}
              </Typography>

              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                Start Date: {competition.start_date}
              </Typography>

              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                End Date: {competition.end_date}
              </Typography>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleEventJoin(competition.id)}
                disabled={competition.joined}
              >
                {competition.joined ? "Joined" : "Join"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to={`/competitions/${competition.id}`}
                disabled={!competition.joined}
              >
                Dashboard
              </Button>
            </Paper>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
};

interface ContestInfo {
  name: string;
  description: string;
  initial_value: number;
  start_date: string;
  end_date: string;
}

interface CreateEventProps {
  onClose: () => void;
}

const CreateEvent = ({ onClose }: CreateEventProps) => {
  const [contestInfo, setContestInfo] = useState<ContestInfo>({
    name: "",
    description: "",
    initial_value: 0,
    start_date: "",
    end_date: "",
  });

  const startContest = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/createcompetition",
        contestInfo
      );
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to create competition:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={contestInfo.name}
        onChange={(e) =>
          setContestInfo((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={contestInfo.description}
        onChange={(e) =>
          setContestInfo((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
      />
      <TextField
        label="Initial Value"
        variant="outlined"
        fullWidth
        value={contestInfo.initial_value}
        onChange={(e) =>
          setContestInfo((prev) => ({
            ...prev,
            initial_value: Number(e.target.value),
          }))
        }
      />
      <TextField
        label="Start Time"
        variant="outlined"
        fullWidth
        value={contestInfo.start_date}
        onChange={(e) =>
          setContestInfo((prev) => ({
            ...prev,
            start_date: e.target.value,
          }))
        }
      />
      <TextField
        label="End Time"
        variant="outlined"
        fullWidth
        value={contestInfo.end_date}
        onChange={(e) =>
          setContestInfo((prev) => ({
            ...prev,
            end_date: e.target.value,
          }))
        }
      />
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={startContest}
      >
        Start Contest
      </Button>
    </Box>
  );
};

export { GetEvents, CreateEvent };
