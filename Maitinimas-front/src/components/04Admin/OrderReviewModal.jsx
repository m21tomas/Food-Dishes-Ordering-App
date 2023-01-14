import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function OrderReviewModal({ orderReviewModal, setOrderReviewModal, orderReviewData }) {

    return (
        <Modal
            show={orderReviewModal}
            onHide={() => setOrderReviewModal(false)}
            size="lg"
            dialogClassName="adminOrdersModalWidth"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title>Užsakymo peržiūra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>Vartotojas: {orderReviewData.username}</h3>
                <div style={{ height: '500px', overflowY: 'scroll' }}>
                    <Table >
                        <thead>
                            <tr>
                                <th className="adminOrdersReview">#</th>
                                <th className="adminOrdersReview">Pavadinimas</th>
                                <th className="adminOrdersReview">Apibūdinimas</th>
                                <th className="adminOrdersReview">Kiekis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderReviewData !== 0 ?
                                    orderReviewData.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="adminOrdersReview">{index + 1}</td>
                                            <td className="adminOrdersReview">{item.dishName}</td>
                                            <td className="adminOrdersReview">{item.dishDescription}</td>
                                            <td className="adminOrdersReview">{item.quantityInCart}</td>
                                        </tr>
                                    ))
                                    : null
                            }
                        </tbody>
                    </Table>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div style={{marginRight: '45%'}}>
                    <Button variant="outline-primary" onClick={() => setOrderReviewModal(false)}>
                        Uždaryti
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default OrderReviewModal