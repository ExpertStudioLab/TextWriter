DELIMITER //
CREATE PROCEDURE GetRowNumber( OUT result BIGINT )
BEGIN
    SELECT COUNT( * ) INTO result
        FROM レコード;
END //
DELIMITER ;
