// EventTicketsForm.tsx
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface Ticket {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  available: number;
  salesStart: Date | string;
  salesEnd: Date | string;
}

const EventTicketsForm = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const handleAddTicket = () => {
    setEditingTicket({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      available: 0,
      salesStart: "",
      salesEnd: "",
    });
    setIsEditing(true);
  };

  const handleSaveTicket = (ticket: Ticket) => {
    if (ticket.id) {
      // Update existing
      setTickets(tickets.map((t) => (t.id === ticket.id ? ticket : t)));
    } else {
      // Add new
      setTickets([...tickets, { ...ticket, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setEditingTicket(null);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Event Tickets</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add ticket types for your event. You can create multiple ticket
            tiers with different prices.
          </p>
        </div>

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div className="space-y-3 mb-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{ticket.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>${ticket.price}</span>
                      <span>•</span>
                      <span>{ticket.quantity} available</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingTicket(ticket);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id!)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-4">No tickets added yet</p>
            <button
              onClick={handleAddTicket}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Ticket
            </button>
          </div>
        )}

        {tickets.length > 0 && (
          <button
            onClick={handleAddTicket}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Ticket Type
          </button>
        )}
      </div>

      {/* Ticket Editor Modal */}
      {isEditing && editingTicket && (
        <TicketEditor
          ticket={editingTicket}
          onSave={handleSaveTicket}
          onCancel={() => {
            setIsEditing(false);
            setEditingTicket(null);
          }}
        />
      )}
    </div>
  );
};

// Simple Ticket Editor Component
const TicketEditor = ({
  ticket,
  onSave,
  onCancel,
}: {
  ticket: Ticket;
  onSave: (ticket: Ticket) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(ticket);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, available: formData.quantity });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket.id ? "Edit Ticket" : "Add Ticket"}
            </h3>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., General Admission"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe what's included with this ticket"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Start
                </label>
                <input
                  type="datetime-local"
                  name="salesStart"
                  value={
                    formData.salesStart instanceof Date
                      ? formData.salesStart.toISOString().slice(0, 16)
                      : formData.salesStart
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales End
                </label>
                <input
                  type="datetime-local"
                  name="salesEnd"
                  value={
                    formData.salesEnd instanceof Date
                      ? formData.salesEnd.toISOString().slice(0, 16)
                      : formData.salesEnd
                  }
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {ticket.id ? "Update Ticket" : "Add Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventTicketsForm;
