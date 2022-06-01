import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function Main() {
    const [newItem, setNewItem] = React.useState({ cars: "", threshold: "" });
    const [list, setList] = React.useState([]);
    const [listLen, setListLen] = React.useState(0);
    const [serverResponse, setServerResponse] = React.useState(false);

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
                const res_parsed = await res.json();
                const cars = res_parsed['cars'];
                setListLen(cars.length);
                setList(cars);
                setServerResponse(true);
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
                    <Form.Group className="mb-3" controlId="formBasicEmail" style={{marginTop: '3rem', textAlign: "-webkit-center"}}>
                        <Form.Label>Which cars are you interested in?</Form.Label>
                        <Form.Control type="number" placeholder="Select 1, 2, 3, 4, or 5" style={{textAlignLast: "center", maxWidth: "30rem"}} onInput={e => setNewItem(prevState => ({
                            ...prevState,
                            cars: e.target.value
                        }))}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword" style={{textAlign: "-webkit-center"}}>
                        <Form.Label>Enter CO2 threshold for your car</Form.Label>
                        <Form.Control type="number" placeholder="Any number between 96 to 522" style={{textAlignLast: "center", maxWidth: "30rem"}} onInput={e => setNewItem(prevState => ({
                            ...prevState,
                            threshold: e.target.value
                        }))}/>
                    </Form.Group>
                    <Button variant="primary" onClick={getResults}>
                        Submit
                    </Button>
                </Form>
            </Container>
            <Container style={{marginTop: '6rem'}}>
                {serverResponse ?
                    <>
                        {listLen > 0 ?
                            <>
                                <h4>We found {listLen} car(s) that match your description!</h4>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Make</th>
                                            <th>Model</th>
                                            <th>CO2 Emissions (g/km)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((val, index) => {
                                            return (<tr>
                                                        <td>{index + 1}</td>
                                                        <td>{val[0]}</td>
                                                        <td>{val[1]}</td>
                                                        <td>{val[2]}</td>
                                                    </tr>);
                                        })}
                                    </tbody>
                                </Table>
                            </>
                            :
                            <>
                                <h4>Sorry, but nothing matched your criteria. Please try again with some different values.</h4>
                            </>
                        }
                    </>
                    :
                    <></>
                }
                
            </Container>
        </div>
    );
}