import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  gameMode: text("game_mode").notNull().default("Squad"), // Solo, Duo, Squad, Lone Wolf
  map: text("map").notNull().default("Bermuda"),
  matchDate: timestamp("match_date").notNull(),
  entryFee: integer("entry_fee").notNull().default(100),
  prizePool: integer("prize_pool").notNull().default(1000),
  perKill: integer("per_kill").notNull().default(20),
  maxSlots: integer("max_slots").notNull().default(48),
  status: text("status").notNull().default("upcoming"), // upcoming, live, full, completed
  roomId: text("room_id").default(""),
  roomPass: text("room_pass").default(""),
  description: text("description").default(""),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  teamName: text("team_name").notNull(),
  captainName: text("captain_name").notNull(),
  whatsapp: text("whatsapp").notNull(),
  ffUid: text("ff_uid").notNull(),
  teamMembers: text("team_members").default(""),
  paymentMethod: text("payment_method").notNull(), // Easypaisa, JazzCash, Sadapay
  senderNumber: text("sender_number").notNull(),
  trxId: text("trx_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  tournamentTitle: text("tournament_title").notNull(),
  position: integer("position").notNull().default(1),
  teamName: text("team_name").notNull(),
  playerName: text("player_name").default(""),
  prize: integer("prize").notNull().default(0),
  kills: integer("kills").default(0),
  matchDate: timestamp("match_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Tournament = typeof tournaments.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type Winner = typeof winners.$inferSelect;
