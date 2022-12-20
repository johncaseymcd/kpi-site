-- create USERS schema
create schema if not exists users;

-- create extension for new UUIDs
create extension if not exists "uuid-ossp";

-- create MEMBERS table and indexes
create table if not exists users.members(
  member_id uuid not null default uuid_generate_v4(),
  first_name varchar(50) not null,
  middle_name varchar(50) null,
  last_name varchar(50) not null,
  nickname varchar(50) null,
  email varchar(50) not null,
  phone_number varchar(10),
  street_address varchar(100) not null,
  unit_number varchar(16) null,
  city varchar(50) not null,
  state varchar(25) not null,
  zip integer not null,
  found_method varchar(25) not null,
  pronouns varchar(25) not null,
  neopronouns varchar(25) null,
  birthday timestamp not null,
  twitter_handle varchar(32) null,
  instagram_handle varchar(32) null,
  dietary_restrictions text not null,
  has_attended_event boolean not null default false,
  is_admin boolean not null default false,
  is_on_mailing_list boolean not null default false,
  is_over_18 boolean not null,
  is_over_21 boolean not null,
  constraint members_pk primary key (member_id)
);

create index members_query_idx on users.members using btree (first_name, middle_name, last_name, email, phone_number) include (twitter_handle, instagram_handle);

-- create ADMINS table and indexes
create table if not exists users.admins(
  admin_id serial not null,
  member_id uuid not null,
  role varchar(25) not null,
  platform varchar(25) not null,
  section varchar(25) not null,
  constraint admins_pk primary key (admin_id),
  foreign key (member_id) references users.members (member_id)
);

create index admins_query_idx on users.admins using btree (role, platform, section);

-- create PLACES schema
create schema if not exists places;

-- create LOCATIONS table and indexes
create table if not exists places.locations(
  location_id serial not null,
  name varchar(255) not null,
  street_address varchar(100) not null,
  unit_number varchar(16) null,
  city varchar(50) not null,
  state varchar(25) not null,
  zip int not null,
  location_type varchar(25) not null,
  constraint locations_pk primary key (location_id)
);

create index on places.locations using btree (name, street_address, unit_number, city, state, zip, location_type);

-- create BUSINESSES schema
create schema if not exists businesses;

-- create VENUES table and indexes
create table if not exists businesses.venues(
  venue_id serial not null,
  location_id int not null,
  name varchar(255) not null,
  contact varchar(100) null,
  cost decimal not null,
  cost_type varchar(50) not null,
  constraint venues_pk primary key (venue_id),
  foreign key (location_id) references places.locations (location_id)
);

create index venues_query_idx on businesses.venues using btree (name, cost) include (location_id, contact);

-- create SPONSORS table and indexes
create table if not exists businesses.sponsors(
  sponsor_id serial not null,
  name varchar(255) not null,
  sponsor_type varchar(25) not null,
  contact varchar(100) null,
  constraint sponsors_pk primary key (sponsor_id)
);

create index sponsors_query_idx on businesses.sponsors using btree (name, sponsor_type) include (contact);

-- create CONTACTS schema
create schema if not exists contacts;

-- create VENUE_CONTACTS table and indexes
create table if not exists contacts.venue_contacts(
  contact_id serial not null,
  venue_id int not null,
  first_name varchar(50) not null,
  last_name varchar(50) not null,
  email varchar(50) not null,
  phone_number varchar(10) not null,
  constraint venue_contacts_pk primary key (contact_id),
  foreign key (venue_id) references businesses.venues (venue_id)
);

create index venue_contacts_query_idx on contacts.venue_contacts using btree (first_name, last_name, email, phone_number) include (venue_id);

-- create SPONSOR_CONTACTS table and indexes
create table if not exists contacts.sponsor_contacts(
  contact_id serial not null,
  sponsor_id int not null,
  first_name varchar(50) not null,
  last_name varchar(50) not null,
  email varchar(50) not null,
  phone_number varchar(10) not null,
  constraint sponsor_contacts_pk primary key (contact_id),
  foreign key (sponsor_id) references businesses.sponsors (sponsor_id)
);

create index sponsor_contacts_query_idx on contacts.sponsor_contacts using btree (first_name, last_name, email, phone_number) include (sponsor_id);

-- create EMERGENCY_CONTACTS table and indexes
create table if not exists contacts.emergency_contacts(
  contact_id serial not null,
  first_name varchar(50) not null,
  last_name varchar(50) not null,
  email varchar(50) not null,
  phone_number varchar(10) not null,
  constraint emergency_contacts_pk primary key (contact_id)
);

create index emergency_contacts_query_idx on contacts.emergency_contacts using btree (first_name, last_name, email, phone_number);

-- create FINANCES schema
create schema if not exists finances;

-- create EXPENSES table and indexes
create table if not exists finances.expenses(
  expense_id bigserial not null,
  name varchar(255) not null,
  cost decimal not null,
  expense_type varchar(50) not null,
  is_paid boolean not null default false,
  incurred_date timestamptz not null,
  due_date timestamptz not null,
  is_tax_deductible boolean not null default false,
  constraint expenses_pk primary key (expense_id)
);

create index expenses_query_idx on finances.expenses using btree (name, cost, is_paid, due_date);

-- create EVENTS schema
create schema if not exists events;

-- create RSVPS table and indexes
create table if not exists events.rsvps(
  rsvp_id bigserial not null,
  response varchar(5) not null,
  member_count int not null,
  member_names varchar(255) null,
  contact_id int not null,
  constraint rsvps_pk primary key (rsvp_id),
  foreign key (contact_id) references contacts.emergency_contacts (contact_id)
);

create index rsvp_query_idx on events.rsvps using btree (response, member_count);

-- create KPI_EVENTS table and indexes
create table if not exists events.kpi_events(
  event_id serial not null,
  name varchar(255) not null,
  venue_id int not null,
  description text not null,
  event_date timestamptz not null,
  price decimal not null,
  expected_guests int not null,
  suggested_price decimal null,
  actual_profit decimal null,
  turnout_percentage decimal null,
  constraint kpi_events_pk primary key (event_id),
  foreign key (venue_id) references businesses.venues (venue_id)
);

create index kpi_events_query_idx on events.kpi_events using btree (name, venue_id, price, actual_profit, turnout_percentage);

-- create JOINERS schema
create schema if not exists joiners;

-- create table to join MEMBERS and EVENTS
create table if not exists joiners.members_events(
  members_events_id bigserial not null,
  member_id uuid not null,
  event_id int not null,
  constraint members_events_pk primary key (members_events_id),
  foreign key (member_id) references users.members (member_id),
  foreign key (event_id) references events.kpi_events (event_id)
);

-- create table to join ADMINS and EVENTS
create table if not exists joiners.admins_events(
  admins_events_id bigserial not null,
  admin_id int not null,
  event_id int not null,
  constraint admins_events_pk primary key (admins_events_id),
  foreign key (admin_id) references users.admins (admin_id),
  foreign key (event_id) references events.kpi_events (event_id)
);

-- create table to join SPONSORS and EVENTS
create table if not exists joiners.sponsors_events(
  sponsors_events_id serial not null,
  sponsor_id int not null,
  event_id int not null,
  constraint sponsors_events_pk primary key (sponsors_events_id),
  foreign key (sponsor_id) references businesses.sponsors (sponsor_id),
  foreign key (event_id) references events.kpi_events (event_id)
);

-- create table to join MEMBERS and EMERGENCY CONTACTS
create table if not exists joiners.members_emergency_contacts(
  members_emergency_contacts_id serial not null,
  member_id uuid not null,
  contact_id int not null,
  constraint members_emergency_contacts_pk primary key (members_emergency_contacts_id),
  foreign key (member_id) references users.members (member_id),
  foreign key (contact_id) references contacts.emergency_contacts (contact_id)
);

-- create table to join EXPENSES and EVENTS
create table if not exists joiners.expenses_events(
  expenses_events_id bigserial not null,
  expense_id bigint not null,
  event_id int not null,
  constraint expenses_events_pk primary key (expenses_events_id),
  foreign key (expense_id) references finances.expenses (expense_id),
  foreign key (event_id) references events.kpi_events (event_id)
);

-- create table to join RSVPS and EVENTS
create table if not exists joiners.rsvps_events(
  rsvps_events_id bigserial not null,
  rsvp_id bigint not null,
  event_id int not null,
  constraint rsvps_events_pk primary key (rsvps_events_id),
  foreign key (rsvp_id) references events.rsvps (rsvp_id),
  foreign key (event_id) references events.kpi_events (event_id)
);

-- create table to join RSVPS and MEMBERS
create table if not exists joiners.rsvps_members(
  rsvps_members_id bigserial not null,
  rsvp_id bigint not null,
  member_id uuid not null,
  constraint rsvps_members_pk primary key (rsvps_members_id),
  foreign key (rsvp_id) references events.rsvps (rsvp_id),
  foreign key (member_id) references users.members (member_id)
);

-- create USER accounts for various db access levels, grant permissions accordingly
create user if not exists kpi_admin with password "default_pass";
create user if not exists kpi_team with password "default_pass";
create user if not exists kpi_users with password "default_pass";

grant all on database kpidb to kpi_admin;
grant create, connect on database kpidb to kpi_team;
grant connect on database kpidb to kpi_users;

grant usage on schema users, places, businesses, contacts, finances, events, joiners to kpi_admin, kpi_team, kpi_users;

grant all on all tables in schema users, places, businesses, contacts, finances, events, joiners to kpi_admin;
grant select, insert, update on all tables in schema users, places, businesses, contacts, finances, events, joiners to kpi_team;
grant select on table users.admins, businesses.venues, contacts.emergency_contacts, events.kpi_events, joiners.rsvps_events, joiners.rsvps_members to kpi_users;
grant select, insert on table users.members, events.rsvps to kpi_users;