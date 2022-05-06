# Eventuous Connector

## Sidecar sample for SQL Server

The sidecar is a gRPC bidirectional streaming server. It receives events from the connector and sends SQL statements back. The connector will take care about:
- Subscribing to EventStoreDB
- Pushing events to the sidecar
- Receiving SQL statements from the sidecar
- Executing SQL statements
- Storing the checkpoint

The table needed for this sample is:

```sql
create table [Bbookings] (
    BookingId varchar(40) not null primary key,
    RoomId varchar(40), 
    GuestId varchar(40), 
    OutstandingAmount numeric
);
```
