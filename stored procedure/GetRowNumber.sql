DELIMITER //
CREATE PROCEDURE GetRowNumber( OUT title_rows SMALLINT,
                                OUT section_rows TINYINT,
                                OUT column_rows TINYINT )
BEGIN
    SELECT COUNT( * ) INTO title_rows
    FROM タイトル名;

    SELECT COUNT( * ) INTO section_rows
    FROM セクション名;

    SELECT COUNT( * ) INTO column_rows
    FROM コラム名;
END //
DELIMITER ;
