import TicketApp from './TicketApp';
import TicketModel from '../../models/ticket';
import GameModel from '../../models/game';
import {
  Ticket,
  TicketAppName,
  ScrapeTicketsResult,
  saveTicketsResponse,
  GameResponse,
} from '../../types';

/**
 * Abstract class representing a ticket resale app.
 *
 * @abstract
 * @implements {TicketApp}
 */
abstract class AbstractTicketApp implements TicketApp {
  abstract readonly name: TicketAppName;

  abstract scrapeEventUrls(): Promise<string[]>;

  abstract scrapeTickets(url: string, ticketQuantity: number): Promise<ScrapeTicketsResult>;

  async saveTickets(tickets: Ticket[]): Promise<saveTicketsResponse> {
    try {
      const savedTickets = await TicketModel.insertMany(tickets);
      return savedTickets;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: 'Error saving tickets' };
    }
  }

  async addTicketsToGame(
    gameId: string,
    tickets: Ticket[],
    ticketQuantity: number,
    scrapeDateTime: Date,
  ): Promise<GameResponse> {
    try {
      const game = await GameModel.findById(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      const existingTicketQuantityGroup = game.ticketQuantityGroups.find(
        group => group.ticketQuantity === ticketQuantity,
      );
      if (existingTicketQuantityGroup) {
        // Delete previous tickets from this app
        const ticketsToDelete = existingTicketQuantityGroup.tickets.filter(
          ticket => ticket.app === this.name,
        );
        await TicketModel.deleteMany({ _id: { $in: ticketsToDelete.map(ticket => ticket._id) } });

        // Update existing ticket quantity group
        existingTicketQuantityGroup.tickets = existingTicketQuantityGroup.tickets.filter(
          ticket => ticket.app !== this.name,
        );
        existingTicketQuantityGroup.tickets.push(...tickets);
        existingTicketQuantityGroup.lastUpdated = scrapeDateTime;
      } else {
        game.ticketQuantityGroups.push({
          ticketQuantity,
          lastUpdated: scrapeDateTime,
          tickets,
        });
      }

      await game.save();
      return game;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }
      return { error: 'Error when adding tickets to game' };
    }
  }
}

export default AbstractTicketApp;
