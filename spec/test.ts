import {Example} from "../src/index";
require("jasmine");

describe("Example", () => {
    it("Should allow instantiation", () => {
        let id = "123";
        let example = new Example(id);
        expect(example.id).toEqual(id)
    });
})