DELIMITER //
CREATE PROCEDURE AddTag( IN tag_name VARCHAR( 40 ), out result BOOLEAN )
BEGIN
IF( SELECT COUNT( * ) FROM タグ名 WHERE タグ = tag_name ) = 0
THEN
BEGIN
    INSERT INTO タグ名( タグ ) VALUES( tag_name );
    SET result = TRUE;
END;
ELSE
BEGIN
    SET result = FALSE;
END;
END IF;
END//
DELIMITER ;
