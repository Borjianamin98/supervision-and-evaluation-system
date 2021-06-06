package ir.ac.sbu.evaluation.dto.university;

import ir.ac.sbu.evaluation.model.university.University;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UniversitySaveDto {

    @NotBlank
    private String name;

    private String location;

    private String webAddress;

    public UniversitySaveDto() {
    }

    @Builder
    public UniversitySaveDto(String name, String location, String webAddress) {
        this.name = name;
        this.location = location;
        this.webAddress = webAddress;
    }

    public University toUniversity() {
        return University.builder()
                .name(name)
                .location(location)
                .webAddress(webAddress)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UniversitySaveDto that = (UniversitySaveDto) o;
        return Objects.equals(name, that.name)
                && Objects.equals(location, that.location)
                && Objects.equals(webAddress, that.webAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, location, webAddress);
    }
}
