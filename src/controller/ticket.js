import { v4 as uuidv4 } from "uuid";
import TicketModel from "../model/ticket.js";
import UserModel from "../model/user.js";

const BUY_TICKET = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await UserModel.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.moneyBalance < req.body.ticketPrice) {
      return res.status(422).json({ message: "Insufficient money balance" });
    }

    const ticket = new TicketModel({
      id: uuidv4(),
      title: req.body.title,
      ticketPrice: req.body.ticketPrice,
      fromLocation: req.body.fromLocation,
      toLocation: req.body.toLocation,
      toLocationPhotoUrl: req.body.toLocationPhotoUrl,
      ownerId: userId,
    });

    await ticket.save();

    // user.boughtTickets.push(ticket.id);
    // user.moneyBalance = user.moneyBalance - req.body.ticketPrice;

    // await user.save();

    
    await UserModel.updateOne(
      { id: userId },
      {
        $inc: { moneyBalance: -req.body.ticketPrice },
        $push: { boughtTickets: ticket.id },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Ticket purchased successfully",
      ticket: ticket,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

export { BUY_TICKET };
