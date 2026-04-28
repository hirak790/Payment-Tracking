// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentTracking {
    enum InvoiceStatus { Pending, Paid, Overdue, Cancelled }

    struct Invoice {
        address issuer;
        address recipient;
        string description;
        uint256 amount;
        uint256 paidAmount;
        InvoiceStatus status;
        uint256 dueDate;
        uint256 createdAt;
        uint256 paidAt;
    }

    mapping(string => Invoice) public invoices;
    string[] public invoiceIds;

    // Events
    event InvoiceCreated(string indexed id, address indexed issuer, address indexed recipient, uint256 amount, uint256 dueDate);
    event InvoicePaid(string indexed id, address indexed payer, uint256 paidAmount, uint256 paidAt);
    event InvoiceOverdue(string indexed id, address indexed issuer);
    event InvoiceCancelled(string indexed id, address indexed issuer);

    function createInvoice(
        string memory id,
        address issuer,
        address recipient,
        string memory description,
        uint256 amount,
        uint256 dueDate
    ) public {
        require(msg.sender == issuer, "Only issuer can create");
        require(bytes(description).length > 0, "Invalid description");
        require(amount > 0, "Invalid amount");
        require(invoices[id].issuer == address(0), "Invoice ID already exists");

        invoices[id] = Invoice({
            issuer: issuer,
            recipient: recipient,
            description: description,
            amount: amount,
            paidAmount: 0,
            status: InvoiceStatus.Pending,
            dueDate: dueDate,
            createdAt: block.timestamp,
            paidAt: 0
        });

        invoiceIds.push(id);

        emit InvoiceCreated(id, issuer, recipient, amount, dueDate);
    }

    function markPaid(
        string memory id,
        address payer,
        uint256 paidAmount,
        uint256 paidAt
    ) public {
        require(msg.sender == payer, "Only payer can mark paid");
        Invoice storage invoice = invoices[id];
        require(invoice.issuer != address(0), "Invoice not found");
        require(invoice.status != InvoiceStatus.Paid, "Already paid");
        require(invoice.status != InvoiceStatus.Cancelled, "Already cancelled");

        invoice.paidAmount = paidAmount;
        invoice.status = InvoiceStatus.Paid;
        invoice.paidAt = paidAt;

        emit InvoicePaid(id, payer, paidAmount, paidAt);
    }

    function markOverdue(string memory id, address issuer) public {
        require(msg.sender == issuer, "Only issuer can mark overdue");
        Invoice storage invoice = invoices[id];
        require(invoice.issuer != address(0), "Invoice not found");
        require(invoice.issuer == issuer, "Not the issuer");
        require(invoice.status == InvoiceStatus.Pending, "Can only mark pending as overdue");

        invoice.status = InvoiceStatus.Overdue;

        emit InvoiceOverdue(id, issuer);
    }

    function cancelInvoice(string memory id, address issuer) public {
        require(msg.sender == issuer, "Only issuer can cancel");
        Invoice storage invoice = invoices[id];
        require(invoice.issuer != address(0), "Invoice not found");
        require(invoice.issuer == issuer, "Not the issuer");
        require(invoice.status != InvoiceStatus.Paid, "Already paid");
        require(invoice.status != InvoiceStatus.Cancelled, "Already cancelled");

        invoice.status = InvoiceStatus.Cancelled;

        emit InvoiceCancelled(id, issuer);
    }

    function getInvoice(string memory id) public view returns (Invoice memory) {
        require(invoices[id].issuer != address(0), "Invoice not found");
        return invoices[id];
    }

    function listInvoices() public view returns (string[] memory) {
        return invoiceIds;
    }

    function getTotalOutstanding() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < invoiceIds.length; i++) {
            Invoice memory invoice = invoices[invoiceIds[i]];
            if (invoice.status != InvoiceStatus.Paid && invoice.status != InvoiceStatus.Cancelled) {
                total += (invoice.amount - invoice.paidAmount);
            }
        }
        return total;
    }
}
