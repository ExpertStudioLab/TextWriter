DELIMITER //

CREATE PROCEDURE DeleteColumn( IN title VARCHAR(50), IN tagIndex TINYINT, IN section VARCHAR(80), IN columnName VARCHAR(100) )
BEGIN
    DELETE FROM コラム名 WHERE コラム = columnName;
    IF( SELECT COUNT(*)
            FROM レコード
        WHERE タイトル = title AND タグインデックス = tagIndex
            AND セクション = section ) = 0 THEN
        BEGIN
            DELETE FROM セクション名 WHERE セクション = section;
            IF( SELECT COUNT(*)
                    FROM レコード
                WHERE タイトル = title AND タグインデックス = tagIndex ) = 0 THEN
                BEGIN
                    DELETE FROM タイトル名 WHERE タイトル = title;
                END;
            END IF;
        END;
    END IF;
END //

DELIMITER ;
