//% color="#AA278D" icon="\uf447" weight=54
namespace castles {
    /**
     * Build a castle wall of specified width, length, and height out of blockType
     * @param width how thick the wall will be. If at least 3, there will be a gap for inner and outer walls
     * @param length how far a wall will span in blocks
     * @param height the number of blocks high the wall will stand
     * @param blockType the Minecraft block the wall will be built with
     */
    //% blockId=castles_build_wall
    //% block="build castle wall|made of $blockType width $width length $length height $height||at position $position"
    //% width.defl=3
    //% width.min=2 width.max=1000
    //% length.defl=27
    //% length.min=4 length.max=1000
    //% height.defl=6
    //% height.min=1 height.max=1000
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Cobblestone
    //% position.shadow=minecraftCreatePosition
    //% weight=340
    //% help=github:makecode-minecraft-castle-builder/docs/castle-wall
    export function buildCastleWall(
        width: number,
        length: number,
        height: number,
        blockType: number,
        position?: Position
        ) {
        if (position) {
            builder.shift(position.getValue(Axis.X) - Math.floor(width / 2), 0, position.getValue(Axis.Z) - Math.floor(width / 2))
        } else {
            builder.shift(- Math.floor(width / 2), 0, - Math.floor(width / 2))
        }
        // build 2 walls from bottom to top (up to WallHeight)
        for (let index4 = 0; index4 < height - 1; index4++) {
            drawRectangle(length, width, blockType)
            builder.move(UP, 1)
        }
        drawAlternatingRectangle(length - 2, width - 2, blockType)
        builder.shift(length - Math.floor(width / 2) - 1, 1 - height, Math.floor(width / 2))
    }

    /**
     * Build a castle tower of specified width since we want the tower to be square of type blockType
     * @param width the length of the sides of the square tower
     * @param height the number of blocks high the tower will stand
     * @param blockType the Minecraft block the tower will be built with
     */
    //% blockId=castles_build_tower
    //% block="build castle tower|made of $blockType width $width height $height||at position $position"
    //% width.defl=5
    //% width.min=2 width.max=1000
    //% height.defl=8
    //% height.min=1 height.max=1000
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Cobblestone
    //% inlineInputMode="external"
    //% position.shadow=minecraftCreatePosition
    //% weight=350
    //% help=github:makecode-minecraft-castle-builder/docs/castle-tower
    export function buildCastleTower(width: number, height: number, blockType: number, position?: Position) {
        if (position) {
            builder.shift(position.getValue(Axis.X) - Math.floor(width / 2), 0, position.getValue(Axis.Z) - Math.floor(width / 2))
        } else {
            builder.shift(- Math.floor(width / 2), 0, - Math.floor(width / 2))
        }
        // build tower base
        buildTower(width, height, blockType);
        // build the look-out part, larger by 1 (the shift)
        builder.shift(-1, 0, -1)
        buildTower(width + 2, 2, blockType);

        // build battlement part
        drawAlternatingRectangle(width, width, blockType)

        // mov builder back to center
        builder.shift(Math.floor(width / 2) + 1, 0 - (height + 4), Math.floor(width / 2) + 1)
    }

    /**
     * Build a simple castle with four towers and four walls around the player made of type blockType
     * @param blockType the Minecraft block the castle will be built with
     */
    //% blockId=castles_build_simple_castle
    //% block="build a simple castle made of $blockType||at position $position"
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Cobblestone
    //% position.shadow=minecraftCreatePosition
    //% weight=250
    //% help=github:makecode-minecraft-castle-builder/docs/simple-castle
    export function buildSimpleCastle(blockType: number, position?: Position) {
        let teleportPos = position ? position : player.position();
        // move builder back to player position to allow repeat usage
        builder.teleportTo(teleportPos)
        // start off facing left of the player
        builder.face(getDirectionLeftOfPlayer())
        // shift away from player
        builder.shift(-13, 0, -13)

        buildCastle(blockType);
    }

    /**
     * Build a simple castle in the sky made with the specified block type
     * @param blockType the Minecraft block the castle will be built with
     */
    //% blockId=castles_build_sky_castle
    //% block="build a castle in the sky made of $blockType || with beanstalk $beanstalk||at position $position"
    //% blockType.shadow=minecraftBlock
    //% blockType.defl=Block.Cobblestone
    //% beanstalk.defl=false
    //% weight=150
    //% help=github:makecode-minecraft-castle-builder/docs/sky-castle
    export function buildCastleInTheSky(blockType: number, beanstalk?: boolean, position?: Position) {
        let teleportPos = position ? position : player.position()
        builder.teleportTo(teleportPos)
        builder.face(getDirectionLeftOfPlayer())
        builder.turn(RIGHT_TURN)

        builder.shift(24, 20, 0);
        const cloudCenter = builder.position();
        shapes.circle(Block.Wool, cloudCenter, 23, Axis.Y, ShapeOperation.Replace)
        builder.shift(-13, 1, -13)

        buildCastle(blockType);
        if (beanstalk) {
            growBeanStalk(20, cloudCenter.add(pos(-2, -20, 0)));
        }
    }

    /**
     * Grow a bean stalk to reach a castle in the sky
     * @param height how many blocks tall the bean stalk will be
     * @param position where the beanstalk will grow
     */
    //% blockId=castles_grow_bean_stalk
    //% block="grow a bean stalk with height $height at $position"
    //% position.shadow=minecraftCreatePosition
    //% height.defl=20
    //% weight=145
    //% help=github:makecode-minecraft-castle-builder/docs/bean-stalk
    export function growBeanStalk(height: number, position: Position) {
        agent.teleport(position, getDirectionLeftOfPlayer());
        agent.setItem(GREEN_WOOL, height, 1);
        agent.setItem(LADDER, height, 2);
        for (let i = 0; i < height; i++) {
            agent.setSlot(1);
            agent.place(FORWARD);
            agent.setSlot(2);
            agent.place(FORWARD);
            agent.move(UP, 1);
        }
        agent.destroy(UP);
        agent.teleportToPlayer();
    }

    /**
     * Helper function for building the solid base and top of a tower
     * @param width the length of the sides of the square tower
     * @param height the number of blocks high the tower will stand
     * @param blockType the Minecraft block the tower will be built with
     */
    function buildTower(width: number, height: number, blockType: number) {
        for (let index = 0; index <= height; index++) {
            drawRectangle(width, width, blockType);
            builder.move(UP, 1)
        }
    }

    /**
     * Helper function for building simple castles. 
     * Both building a castle in the sky and building a simple castle use the same logic
     * @param blockType the Minecraft block the castle will be built with
     */
    function buildCastle(blockType: number) {
        for (let index = 0; index < 4; index++) {
            buildCastleTower(5, 8, blockType);
            buildCastleWall(3, 27, 6, blockType);
            builder.turn(LEFT_TURN);
        }
    }

    /**
     * Helper function for drawing rectangle sides
     * @param length the length of the line
     * @param blockType the Minecraft block the line will be built with
     */
    function drawLine(length: number, blockType: number) {
        builder.mark()
        builder.move(FORWARD, length - 1)
        builder.tracePath(blockType)
        builder.turn(LEFT_TURN)
    }

    /**
     * Draw a rectangle with the builder to make building towers and walls easy
     * @param length how many blocks long the rectangle will be
     * @param width how many blocks wide the rectangle will be
     * @param blockType the Minecraft block the rectangle will be built with
     */
    function drawRectangle(length: number, width: number, blockType: number) {
        for (let index = 0; index < 2; index++) {
            drawLine(length, blockType);
            drawLine(width, blockType);
        }
    }

    /**
     * Draws a line where a block is placed every other index
     * @param length how many blocks long the alternating line should span
     * @param start whether or not a block should be placed at the 0th index
     * @param blockType the Minecraft block the alternating line will be drawn with
     * @returns boolean, this is for the next line to be drawn in the rectangle, whether a block should be placed at the start of the next line
     */
    function drawAlternatingLine(length: number, start: boolean, blockType: number): boolean {
        let placeBlock = start;
        for (let index2 = 0; index2 <= length; index2 ++) {
            builder.move(FORWARD, 1);
            if (placeBlock) {
                builder.place(blockType);
            }
            placeBlock = !placeBlock
        }
        return placeBlock;
    }

    /**
     * Draws an alternating rectangle for the tops of towers and walls, a block is placed every other index
     * @param length how many blocks long the alternating rectangle will be
     * @param width how many blocks wide the alternating rectangle will be
     * @param blockType the Minecraft block the alternating rectangle will be built with
     */
    function drawAlternatingRectangle(length: number, width: number, blockType: number) {
        for (let index3 = 0; index3 < 2; index3++) {
            let putBlock = drawAlternatingLine(length, false, blockType);
            builder.turn(LEFT_TURN);
            drawAlternatingLine(width, putBlock, blockType);
            builder.turn(LEFT_TURN);
        }
    }

    /**
     * Gets the direction the player is facing so building doesn't start on top of the player
     */
    function getDirectionLeftOfPlayer(): CompassDirection {
        let playerOrientation = player.getOrientation(); // between -180 && 180
        if (playerOrientation >= -45 && playerOrientation < 45) {
            return CompassDirection.East
        }

        if (playerOrientation >= 45 && playerOrientation < 135) {
            return CompassDirection.South
        }

        if (playerOrientation >= -135 && playerOrientation < -45) {
            return CompassDirection.West
        }

        return CompassDirection.North
    }
}