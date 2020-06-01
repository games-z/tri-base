SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points;
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        let prid = pStart(Profiler.IS_SAPIMAP_SEND_ME_MAP_INFO);
        map = DataMap.getMap(mapId);
        points = DataPoints.getPointsByMapId(mapId);

        DataPoints.getUsersInfo(mapId, [cntx.userId], function (userPoints) {
            CAPIMap.gotMapsInfo(cntx.userId, mapId, map, points, userPoints);
            pFinish(prid);
        });
    };

    this.sendMeUsersScore = function (cntx, mapId, userIds) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataMap.existsMap(mapId)) return Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);

        if (userIds.length === 0) return Logs.log("no friends - no data", Logs.LEVEL_DETAIL, cntx);

        let prid = pStart(Profiler.IS_SAPIMAP_SEND_ME_USERS_SCORE);
        //@todo check mapId is isNAN, 0<mapId<MAX_NUMBER
        //@todo check usersIs must be array with only ids 0<i<MAX_NUMBER

        DataPoints.getUsersInfo(mapId, userIds, function (usersPoints) {
            //@todo check size ?
            ////0: {userId: 4, pointId: 37, score: 2920}
            CAPIMap.gotUserScores(cntx.userId, usersPoints);
            pFinish(prid);
        });
    };

    this.sendMePointTopScore = function (cntx, score, pointId, fids, chunks) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (chunks > 1) Logs.log("More then one chunk", Logs.LEVEL_ALERT, arguments);

        if (Number.isNaN(score = Valid.DBUINT(score, true))) return Logs.log(arguments.callee.name + " not valid score", Logs.LEVEL_ALERT, arguments);
        if (!(pointId = Valid.DBUINT(pointId))) return Logs.log(arguments.callee.name + " not valid pointId", Logs.LEVEL_ALERT, arguments);
        if (!(fids = Valid.DBUINTArray(fids))) return Logs.log(arguments.callee.name + "not valid fids", Logs.LEVEL_ALERT, arguments);

        let prid = pStart(Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE);

        DataPoints.getTopScore(score, pointId, fids, function (rows) {
            //console.log(rows);

            DataPoints.getTopScoreUserPosition(score, pointId, fids, cntx.user.id, function (pos) {

                /**
                 * {p1u: 123123, p2u:123213, up:123123 }
                 */
                let out;
                out = {
                    place1Uid: rows[0] ? rows[0].userId : null,
                    place2Uid: rows[1] ? rows[1].userId : null,
                    place3Uid: rows[2] ? rows[2].userId : null,
                    userPosition: pos,
                };
                console.log(pos);
                CAPIMap.gotPointTopScore(cntx.user.id, pointId, out);
                pFinish(prid);
            });

        });
    };

    /**
     * Закончили уровень.
     * @param cntx
     * @param pointId
     * @param score
     * @param chestId
     */
    this.onFinish = function (cntx, pointId, score, chestId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.IS_SAPIMAP_ON_FINISH);
        let tid = LogicTid.getOne();
        /** Обновляем номер точки и очки на ней */
        DataPoints.updateUsersPoints(cntx.userId, pointId, score, function () {

            DataUser.getById(cntx.userId, function (user) {
                if (user.nextPointId < pointId + 1) {

                    DataUser.updateNextPointId(cntx.userId, pointId + 1, function () {
                        Logs.log("LevelUp uid:" + cntx.user.id + " pid:" + (pointId + 1), Logs.LEVEL_ALERT);
                        /** Откроем сундук, если возможно */
                        //@todo check map stars
                        pFinish(prid);
                        if (chestId) {
                            let prid = pStart(Profiler.IS_SAPIMAP_OPEN_CHEST);
                            let chest = DataChests.getById(chestId);

                            if (!chest) {
                                pClear(prid);
                                return Logs.log("no chest found for " + chestId, Logs.LEVEL_WARNING, arguments);
                            } else {
                                Logs.log("Chest open uid:" + cntx.user.id + " cid:" + chestId, Logs.LEVEL_ALERT);
                            }
                            chest.prizes.forEach(function (prize) {
                                switch (prize.id) {
                                    case DataObjects.STUFF_HUMMER:
                                        DataStuff.giveAHummer(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_LIGHTNING:
                                        DataStuff.giveALightning(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_SHUFFLE:
                                        DataStuff.giveAHummer(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_GOLD:
                                        DataStuff.giveAGold(cntx.userId, prize.count, tid);
                                        break;
                                }
                            });
                            //@todo LOCK many hummer light shuffle and gold
                            DataStuff.getByUserId(cntx.userId, function (data) {
                                CAPIStuff.gotStuff(cntx.userId, data);
                                pFinish(prid);
                            });
                        }
                    });
                }
            });
        });
    };

    this.reloadLevels = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataUser.getById(cntx.user.id, function (user) {
            if (!
                (user.id === 1 || user.socNetUserId === 1)
            ) {
                Logs.log("ERROR", Logs.LEVEL_ERROR);
                return;
            }

            LogicSystemRequests.reloadLevels();
        });
    };
};

SAPIMap = new SAPIMap();