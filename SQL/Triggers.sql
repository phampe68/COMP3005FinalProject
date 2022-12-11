CREATE OR REPLACE FUNCTION Book_StockUpdate() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    UPDATE Book set stock = stock - New.quantity where isbn = new.isbn;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION Selections_Remove() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    DELETE FROM UserBookSelections WHERE userid in (SELECT userid FROM BookOrders NATURAL JOIN storeorder where isbn=new.isbn and orderNumber=new.orderNumber);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION BookOrders_Transfer() 
    RETURNS TRIGGER 
    LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO BookOrders (orderNumber,quantity,isbn) SELECT ordernumber,quantity,isbn from storeorder natural join userbookselections where userid=new.userid;
    RETURN NEW;
END;
$$;

CREATE TRIGGER Orders_Trigger 
    AFTER INSERT
    ON StoreOrder
    FOR EACH ROW
       EXECUTE PROCEDURE BookOrders_Transfer();

CREATE TRIGGER BookOrders_Trigger1 
    AFTER INSERT
    ON BookOrders
    FOR EACH ROW
       EXECUTE PROCEDURE Book_StockUpdate();

CREATE TRIGGER BookOrders_Trigger2 
    AFTER INSERT
    ON BookOrders
    FOR EACH ROW
       EXECUTE PROCEDURE Selections_Remove();
    



