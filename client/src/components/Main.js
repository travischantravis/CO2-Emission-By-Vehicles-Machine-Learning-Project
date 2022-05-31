import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Main() {
    const [newItem, setNewItem] = React.useState({ cars: "", threshold: "" });
    document.title = "CO2 Emissions Predictor";
    
    async function getResults() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(newItem),
            });
            if (res.ok){
                const x = await res.json();
                console.log(x);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <Container>
                <Navbar.Brand href="#home">Welcome to Emisison Detector!</Navbar.Brand>
                </Container>
            </Navbar>
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Which cars are you interested in?</Form.Label>
                        <Form.Control type="number" placeholder="Select 1, 2, 3, 4, or 5" onInput={e => setNewItem(prevState => ({
                            ...prevState,
                            cars: e.target.value
                        }))}/>
                        {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text> */}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Enter your CO2 threshold for your car</Form.Label>
                        <Form.Control type="number" placeholder="Any number between x to x" onInput={e => setNewItem(prevState => ({
                            ...prevState,
                            threshold: e.target.value
                        }))}/>
                    </Form.Group>
                    <Button variant="primary" onClick={getResults}>
                        Submit
                    </Button>
                </Form>
            </Container>
            <Container>
                <h4>Server Response:</h4>
            </Container>
        </div>
    );
}