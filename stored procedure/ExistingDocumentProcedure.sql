DELIMITER //
CREATE PROCEDURE ExistingDocument( IN tagIndex TINYINT, IN title VARCHAR(50),
            IN section VARCHAR(80), IN columnName VARCHAR(100), OUT result BOOLEAN )
BEGIN
    SELECT EXISTS( SELECT 1
                        FROM レコード
                    WHERE タグインデックス = tagIndex AND タイトル = title
                        AND セクション = section AND コラム = columnName )
                        INTO result;
END //
DELIMITER ;
