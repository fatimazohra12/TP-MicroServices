import React, { useState, useEffect } from "react";
import {
    getClients,
    getVoitures,
    addClient,
    addVoiture,
    getVoituresByClientId,
    deleteClient,
    deleteVoiture,
    updateClient,
    updateVoiture
} from "../services/apiService";
import { Modal, Button, Form, Table, Card, Row, Col, Container } from "react-bootstrap";

function Dashboard() {
    const [clients, setClients] = useState([]);
    const [voitures, setVoitures] = useState([]);
    const [filteredVoitures, setFilteredVoitures] = useState([]);
    const [searchClientName, setSearchClientName] = useState("");

    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedVoitureId, setSelectedVoitureId] = useState(null);

    const [showClientModal, setShowClientModal] = useState(false);
    const [showVoitureModal, setShowVoitureModal] = useState(false);

    const [newClient, setNewClient] = useState({ nom: "", age: "" });
    const [newVoiture, setNewVoiture] = useState({
        marque: "",
        matricule: "",
        model: "",
    });

    const [isEditingClient, setIsEditingClient] = useState(false);
    const [isEditingVoiture, setIsEditingVoiture] = useState(false);

    useEffect(() => {
        fetchClients();
        fetchVoitures();
    }, []);

    const fetchClients = async () => {
        const response = await getClients();
        setClients(response.data);
    };

    const fetchVoitures = async () => {
        const response = await getVoitures();
        setVoitures(response.data);
    };

    const handleAddOrUpdateClient = async () => {
        if (isEditingClient) {
            await updateClient(selectedClientId, newClient);
        } else {
            await addClient(newClient);
        }
        setNewClient({ nom: "", age: "" });
        fetchClients();
        setShowClientModal(false);
        setIsEditingClient(false);
    };

    const handleAddOrUpdateVoiture = async () => {
        if (isEditingVoiture) {
            await updateVoiture(selectedVoitureId, newVoiture);
        } else {
            await addVoiture(selectedClientId, newVoiture);
        }
        setNewVoiture({ marque: "", matricule: "", model: "" });
        fetchVoitures();
        setShowVoitureModal(false);
        setIsEditingVoiture(false);
    };

    const handleSearchVoituresByClientName = () => {
        const client = clients.find((c) =>
            c.nom.toLowerCase().includes(searchClientName.toLowerCase())
        );
        if (client) {
            setSelectedClientId(client.id);
            handleSearchVoituresByClient(client.id);
        } else {
            setFilteredVoitures([]);
        }
    };

    const handleSearchVoituresByClient = async (clientId) => {
        const response = await getVoituresByClientId(clientId);
        setFilteredVoitures(response.data);
    };

    const handleDeleteClient = async (id) => {
        await deleteClient(id);
        fetchClients();
    };

    const handleDeleteVoiture = async (id) => {
        await deleteVoiture(id);
        fetchVoitures();
    };

    const openEditClientModal = (client) => {
        setNewClient({ nom: client.nom, age: client.age });
        setSelectedClientId(client.id);
        setIsEditingClient(true);
        setShowClientModal(true);
    };

    const openEditVoitureModal = (voiture) => {
        setNewVoiture({
            marque: voiture.marque,
            matricule: voiture.matricule,
            model: voiture.model,
        });
        setSelectedVoitureId(voiture.id);
        setIsEditingVoiture(true);
        setShowVoitureModal(true);
    };

    return (
        <Container className="mt-5">

            {/* Row for Clients and Voitures */}
            <Row className="mb-4">
                {/* Clients Section */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-dark text-white">
                            <h4>Clients</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Age</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr key={client.id}>
                                            <td>{client.nom}</td>
                                            <td>{client.age}</td>
                                            <td>
                                                <Button
                                                    variant="dark"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => openEditClientModal(client)}
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    size="sm"
                                                    onClick={() => handleDeleteClient(client.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button
                                variant="dark"
                                onClick={() => {
                                    setShowClientModal(true);
                                    setIsEditingClient(false);
                                    setNewClient({ nom: "", age: "" });
                                }}
                            >
                                Ajouter Client
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Voitures Section */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-dark text-white">
                            <h4>Voitures</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Marque</th>
                                        <th>Matricule</th>
                                        <th>Model</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {voitures.map((voiture) => (
                                        <tr key={voiture.id}>
                                            <td>{voiture.marque}</td>
                                            <td>{voiture.matricule}</td>
                                            <td>{voiture.model}</td>
                                            <td>
                                                <Button
                                                    variant="dark"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => openEditVoitureModal(voiture)}
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    size="sm"
                                                    onClick={() => handleDeleteVoiture(voiture.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Button
                                variant="dark"
                                onClick={() => {
                                    setShowVoitureModal(true);
                                    setIsEditingVoiture(false);
                                    setNewVoiture({ marque: "", matricule: "", model: "" });
                                }}
                            >
                                Ajouter Voiture
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Search Section */}
            <Card>
                <Card.Header className="bg-dark text-white">
                    <h4>chercher voitures par nom de client</h4>
                </Card.Header>
                <Card.Body>
                    <Form.Control
                        type="text"
                        placeholder=" le nom de client"
                        value={searchClientName}
                        onChange={(e) => setSearchClientName(e.target.value)}
                        className="mb-3"
                    />
                    <Button
                        variant="dark"
                        onClick={handleSearchVoituresByClientName}
                        className="mb-3"
                    >
                        Chercher
                    </Button>
                    <ul>
                        {filteredVoitures.map((voiture) => (
                            <li key={voiture.id}>
                                {voiture.marque} - {voiture.model} ({voiture.matricule})
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>

            {/* Client Modal */}
            <Modal show={showClientModal} onHide={() => setShowClientModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingClient ? "Modifier Client" : "Ajouter Client"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" nom"
                                value={newClient.nom}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, nom: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder=" age"
                                value={newClient.age}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, age: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShowClientModal(false)}>
                        Quitter
                    </Button>
                    <Button variant="dark" onClick={handleAddOrUpdateClient}>
                        {isEditingClient ? "Save Changes" : "Ajouter Client"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Voiture Modal */}
            <Modal show={showVoitureModal} onHide={() => setShowVoitureModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditingVoiture ? "Modifier Voiture" : "Ajouter Voiture"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Marque</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" marque"
                                value={newVoiture.marque}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, marque: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Matricule</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" matricule"
                                value={newVoiture.matricule}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, matricule: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder=" model"
                                value={newVoiture.model}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, model: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Selectioner Client</Form.Label>
                            <Form.Select
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                            >
                                <option value="">Selectioner Client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => setShowVoitureModal(false)}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={handleAddOrUpdateVoiture}>
                        {isEditingVoiture ? "Save Changes" : "Ajouter Voiture"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Dashboard;
