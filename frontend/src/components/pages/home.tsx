import { 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Button 
} from "@mui/material";

function Home() {
    return (
        <Box sx={{ margin: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>
                                Iowa State's Only Trading Competition
                            </Typography>
                            <Typography variant="body1" align="center">
                                Build skills and network with peers
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined" sx={{ padding: 2 }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom>
                                Interested in contributing?
                            </Typography>
                            <Typography variant="body1" align="center">
                                The FinTech Club at Iowa State provides students with many oppurtunitues to contribute to real-world projects. Please 
                                visit the club website and fill out an application if interested.
                            </Typography>
                            <Box sx={{ textAlign: "center", marginTop: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="https://fintechclub.com" 
                                    sx={{ textTransform: "none" }}
                                >
                                    Visit Club Website
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Home;
