import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Documentation = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        API Documentation
      </Typography>
      {apiEndpoints.map((endpoint) => (
        <Accordion key={endpoint.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${endpoint.id}-content`}
            id={`panel${endpoint.id}-header`}
          >
            <Typography variant="h6">{endpoint.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {endpoint.description}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Method:</strong> {endpoint.method}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Request:</strong> {endpoint.request}
            </Typography>
            
            {endpoint.method === "POST" && (
              <>
                <Typography variant="body1" paragraph>
                  <strong>Request Body:</strong>
                </Typography>
                <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
                  <pre>{endpoint.requestBody}</pre>
                </Paper>
              </>
            )}
            
            <Typography variant="body1" paragraph>
              <strong>Response:</strong>
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
              <pre>{endpoint.response}</pre>
            </Paper>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Documentation;



const apiEndpoints = [
    {
      id: 1,
      title: "GET /data/{ticker}",
      description: "Fetches 1 year of historical stock data for given ticker",
      method: "GET",
      request: "GET /data/{ticker}",

      response: 
      `[
        {
          "timestamp": 1,
          "price": "85.94",
          "volume": "1000",
        },
        ...
      ]`,
    },
    {
      id: 2,
      title: "POST /buy",
      description: "Buy a specfic quantity of a stock ",
      method: "POST",
      request: "POST /buy/",
      requestBody: `{
        "id": "WK",
        "cost": "100"
      }`,
      response: `{
        "id": 1,
        "name": "Competition 1",
        "description": "Description of competition",
        "start_date": "2024-01-01",
        "end_date": "2024-01-10"
      }`,
    },
  ];
  

