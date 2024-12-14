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
import { Modal, Button, Form, Card, Row, Col, Container } from "react-bootstrap";

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
            {/* Clients Section */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-4">Clients</h2>
                    {clients.map((client) => (
                        <Card key={client.id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>{client.nom}</Card.Title>
                                <Card.Text>Age: {client.age}</Card.Text>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditClientModal(client)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteClient(client.id)}
                                >
                                    Supprimer
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button
                        variant="success"
                        className="w-100"
                        onClick={() => {
                            setShowClientModal(true);
                            setIsEditingClient(false);
                            setNewClient({ nom: "", age: "" });
                        }}
                    >
                        Ajouter Client
                    </Button>
                </Col>
            </Row>

            {/* Voitures Section */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-4">Voitures</h2>
                    {voitures.map((voiture) => (
                        <Card key={voiture.id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Card.Title>{voiture.marque}</Card.Title>
                                <Card.Text>
                                    Matricule: {voiture.matricule}
                                    <br />
                                    Modèle: {voiture.model}
                                </Card.Text>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => openEditVoitureModal(voiture)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteVoiture(voiture.id)}
                                >
                                    Supprimer
                                </Button>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button
                        variant="success"
                        className="w-100"
                        onClick={() => {
                            setShowVoitureModal(true);
                            setIsEditingVoiture(false);
                            setNewVoiture({ marque: "", matricule: "", model: "" });
                        }}
                    >
                        Ajouter Voiture
                    </Button>
                </Col>
            </Row>

            {/* Search Section */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Recherche de Voitures</Card.Title>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher par nom de client"
                                value={searchClientName}
                                onChange={(e) => setSearchClientName(e.target.value)}
                                className="mb-3"
                            />
                            <Button
                                variant="dark"
                                className="w-100"
                                onClick={handleSearchVoituresByClientName}
                            >
                                Chercher
                            </Button>
                            {filteredVoitures.length > 0 && (
                                <ul className="mt-3">
                                    {filteredVoitures.map((voiture) => (
                                        <li key={voiture.id}>
                                            {voiture.marque} - {voiture.model} ({voiture.matricule})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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
                                placeholder="Nom"
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
                                placeholder="Age"
                                value={newClient.age}
                                onChange={(e) =>
                                    setNewClient({ ...newClient, age: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowClientModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddOrUpdateClient}>
                        {isEditingClient ? "Enregistrer" : "Ajouter"}
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
                                placeholder="Marque"
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
                                placeholder="Matricule"
                                value={newVoiture.matricule}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, matricule: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Modèle</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Modèle"
                                value={newVoiture.model}
                                onChange={(e) =>
                                    setNewVoiture({ ...newVoiture, model: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Client</Form.Label>
                            <Form.Select
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                value={selectedClientId}
                            >
                                <option value="">Sélectionner un client</option>
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
                    <Button variant="secondary" onClick={() => setShowVoitureModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddOrUpdateVoiture}>
                        {isEditingVoiture ? "Enregistrer" : "Ajouter"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Dashboard;
